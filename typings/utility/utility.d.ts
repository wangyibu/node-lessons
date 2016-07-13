declare var utility:basic.api;

declare module "utility" {
     interface LoDashStatic {
        md5(value?: any);
    }
    export = utility;
}

declare module basic {
     interface api {
        md5(value?: any);
    }
}


