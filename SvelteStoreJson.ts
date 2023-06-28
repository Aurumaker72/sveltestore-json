import {get, writable} from "svelte/store";

export function writable_replacer(key, value) {
    if (key == "set" || key == "update" || key == "subscribe" || key == "subscribe2") {
        return null;
    }
    if (value.set) {
        return {
            value: get(value),
            is_writable: true
        };
    }

    return value;
}

export function writable_reviver(key, value) {
    if (value.is_writable) {
        return writable(value.value);
    }
    return value;
}