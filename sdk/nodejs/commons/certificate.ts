// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as utilities from "../utilities";

import * as pulumiAws from "@pulumi/aws";

/**
 * Certificate is a component that manages an ACM Certificate with the DNS validation.
 */
export class Certificate extends pulumi.ComponentResource {
    /** @internal */
    public static readonly __pulumiType = 'cloud-toolkit-aws:commons:Certificate';

    /**
     * Returns true if the given object is an instance of Certificate.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is Certificate {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === Certificate.__pulumiType;
    }

    /**
     * The ACM Certificates used for TLS encryption.
     */
    public /*out*/ readonly certificate!: pulumi.Output<pulumiAws.acm.Certificate>;
    /**
     * The DNS Records.
     */
    public /*out*/ readonly dnsRecords!: pulumi.Output<pulumiAws.route53.Record[]>;
    /**
     * The Pulumi Provider to create the Certificate.
     */
    public /*out*/ readonly provider!: pulumi.Output<pulumiAws.Provider>;

    /**
     * Create a Certificate resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: CertificateArgs, opts?: pulumi.ComponentResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            if ((!args || args.domain === undefined) && !opts.urn) {
                throw new Error("Missing required property 'domain'");
            }
            if ((!args || args.zoneId === undefined) && !opts.urn) {
                throw new Error("Missing required property 'zoneId'");
            }
            resourceInputs["additionalDomains"] = args ? args.additionalDomains : undefined;
            resourceInputs["domain"] = args ? args.domain : undefined;
            resourceInputs["zoneId"] = args ? args.zoneId : undefined;
            resourceInputs["certificate"] = undefined /*out*/;
            resourceInputs["dnsRecords"] = undefined /*out*/;
            resourceInputs["provider"] = undefined /*out*/;
        } else {
            resourceInputs["certificate"] = undefined /*out*/;
            resourceInputs["dnsRecords"] = undefined /*out*/;
            resourceInputs["provider"] = undefined /*out*/;
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        super(Certificate.__pulumiType, name, resourceInputs, opts, true /*remote*/);
    }
}

/**
 * The set of arguments for constructing a Certificate resource.
 */
export interface CertificateArgs {
    additionalDomains?: pulumi.Input<pulumi.Input<string>[]>;
    domain: pulumi.Input<string>;
    zoneId: pulumi.Input<string>;
}