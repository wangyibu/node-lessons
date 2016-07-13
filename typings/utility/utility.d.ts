declare module "utility" {
    export = ut;
}

declare var ut: ut.LoDashStatic;

declare module ut {
     interface LoDashStatic {
        /**
         * Checks if value is classified as a Date object.
         * @param value The value to check.
         *
         * @return Returns true if value is correctly classified, else false.
         */
        md5(value?: any): value is Date;
    }

}


