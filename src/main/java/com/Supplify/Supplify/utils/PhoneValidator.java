package com.Supplify.Supplify.utils;

import java.util.regex.Pattern;

public class PhoneValidator {

    private static final String LOCAL_MOBILE_REGEX = "^05[0123456789]\\d{7}$";
    private static final Pattern LOCAL_MOBILE_PATTERN = Pattern.compile(LOCAL_MOBILE_REGEX);

    public static boolean isValidLocalIsraeliMobile(String phone) {
        if (phone == null) {
            return false;
        }
        return LOCAL_MOBILE_PATTERN.matcher(phone).matches();
    }
}
