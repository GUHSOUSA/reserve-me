export interface StorageProtocol {
  get<T>(key: string): Promise<T>
  set(key: string, value: object): Promise<void>
}