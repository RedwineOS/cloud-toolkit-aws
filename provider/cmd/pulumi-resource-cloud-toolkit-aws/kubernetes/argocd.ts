import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";
import * as random from "@pulumi/random";
import * as yaml from "yaml";
import defaultsDeep from "lodash.defaultsdeep";
import { ArgoCDArgs, defaultArgs } from "./argocdArgs";

export class ArgoCD extends pulumi.ComponentResource {
  private args: ArgoCDArgs;
  private name: string;

  public readonly adminPassword: random.RandomPassword;

  public readonly chart: kubernetes.helm.v3.Chart;

  public readonly namespace: kubernetes.core.v1.Namespace;

  constructor(name: string, args: ArgoCDArgs, opts?: pulumi.ResourceOptions) {
    super("cloud-toolkit-aws:kubernetes:ArgoCD", name, args, opts);
    this.name = name;
    this.args = args;

    const resourceOpts = {
      ...opts,
      parent: this,
      provider: this.args.k8sProvider,
    };

    this.adminPassword = this.setupAdminPassword(resourceOpts);
    this.namespace = this.setupNamespace("system-argocd", resourceOpts);
    const values = this.getChartValues();
    this.chart = this.deployHelmChart(
      "argo-cd",
      "3.33.3",
      "https://argoproj.github.io/argo-helm",
      values,
      resourceOpts,
    );
  }

  protected validateArgs(a: ArgoCDArgs): ArgoCDArgs {
    const args = defaultsDeep({ ...a }, defaultArgs);
    return args;
  }

  private setupAdminPassword(opts: pulumi.ResourceOptions): random.RandomPassword {
    return new random.RandomPassword(this.name, {
      length: 16,
      lower: true,
      number: true,
      special: true,
      upper: true,
    });
  }
  private setupNamespace(
    name: string,
    opts?: pulumi.CustomResourceOptions
  ): kubernetes.core.v1.Namespace {
    return new kubernetes.core.v1.Namespace(
      this.name,
      {
        metadata: {
          name: this.args.namespace,
        },
      },
      opts
    );
  }

  private getChartValues(): any {
    return {
      "redis-ha": {
        enabled: false,
      },
      controller: {
        enableStatefulSet: true,
      },

      server: {
        autoscaling: {
          enabled: false,
        },
        ingress: {
          enabled: this.args.hostname !== undefined,
          ingressClassName: "admin",
          annotations: {
            "external-dns.alpha.kubernetes.io/hostname": this.args.hostname,
            "nginx.ingress.kubernetes.io/force-ssl-redirect": "true",
            "nginx.ingress.kubernetes.io/ssl-passthrough": "true",
            "nginx.ingress.kubernetes.io/backend-protocol": "HTTPS",
          },
          hosts: [this.args.hostname],
        },
      },

      repoServer: {
        autoscaling: {
          enabled: false,
        },
      },
    };
  }

  protected deployHelmChart(
    chart: string,
    version: string,
    repo: string,
    values: any,
    opts?: pulumi.ResourceOptions
  ): kubernetes.helm.v3.Chart {
    const helmChart = new kubernetes.helm.v3.Chart(
      this.name,
      {
        chart: chart,
        namespace: this.namespace.metadata.name,
        version: version,
        fetchOpts: {
          repo: repo,
        },
        values: values,
      },
      opts
    );

    return helmChart;
  }

  protected deployHelmApplication(
    filepath: string,
    helmValues: any
  ): kubernetes.yaml.ConfigFile {
    return new kubernetes.yaml.ConfigFile(
      `${this.name}`,
      {
        file: filepath,
        transformations: [
          (obj: any, opts: pulumi.CustomResourceOptions) => {
            obj.spec.source.helm.values = yaml.stringify(helmValues).toString();
          },
        ],
      },
      {
        provider: this.args.k8sProvider,
      }
    );
  }
}