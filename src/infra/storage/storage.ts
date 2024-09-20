import { StorageProtocol } from "@/data/protocols";

export class LocalStorage implements StorageProtocol {
    async set(key: string, value: object | string) {
        localStorage.setItem(key, JSON.stringify(value));
        window.dispatchEvent(new Event('storage'));
    }

    async get<T>(key: string): Promise<T> {
        const value = localStorage.getItem(key)
        if (!value) throw new Error(`key ${key} not found on storage`)
        return JSON.parse(value)
    }
}