import { District, Province, Ward } from "@/schema/address";

const DB_NAME = "G18_Ecommerce";
const DB_VERSION = 1;

const STORES = {
  PROVINCES: "provinces",
  DISTRICTS: "districts",
  WARDS: "wards",
};

class IndexedDBService {
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject("Không thể mở IndexedDB");
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORES.PROVINCES)) {
          db.createObjectStore(STORES.PROVINCES, { keyPath: "code" });
        }
        if (!db.objectStoreNames.contains(STORES.DISTRICTS)) {
          const districtStore = db.createObjectStore(STORES.DISTRICTS, {
            keyPath: "code",
          });
          districtStore.createIndex("provinceCode", "province_code", {
            unique: false,
          });
        }
        if (!db.objectStoreNames.contains(STORES.WARDS)) {
          const wardStore = db.createObjectStore(STORES.WARDS, {
            keyPath: "code",
          });
          wardStore.createIndex("districtCode", "district_code", {
            unique: false,
          });
        }
      };
    });
  }

  async getProvinces(): Promise<Province[]> {
    return this.getData(STORES.PROVINCES);
  }

  async getDistricts(provinceCode: number): Promise<District[]> {
    return this.getDataByIndex(STORES.DISTRICTS, "provinceCode", provinceCode);
  }

  async getWards(districtCode: number): Promise<Ward[]> {
    return this.getDataByIndex(STORES.WARDS, "districtCode", districtCode);
  }

  async saveProvinces(provinces: Province[]): Promise<void> {
    await this.saveData(STORES.PROVINCES, provinces);
  }

  async saveDistricts(districts: District[]): Promise<void> {
    await this.saveData(STORES.DISTRICTS, districts);
  }

  async saveWards(wards: Ward[]): Promise<void> {
    await this.saveData(STORES.WARDS, wards);
  }

  private async getData(storeName: string): Promise<any[]> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(`Lỗi khi lấy dữ liệu từ ${storeName}`);
      };
    });
  }

  private async getDataByIndex(
    storeName: string,
    indexName: string,
    key: number
  ): Promise<any[]> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(key);

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(`Lỗi khi lấy dữ liệu từ ${storeName} với index ${indexName}`);
      };
    });
  }

  private async saveData(storeName: string, data: any[]): Promise<void> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      // Xóa dữ liệu cũ trước khi lưu mới
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => {
        // Lưu dữ liệu mới
        data.forEach((item) => {
          store.put(item);
        });

        transaction.oncomplete = () => {
          resolve();
        };

        transaction.onerror = () => {
          reject(`Lỗi khi lưu dữ liệu vào ${storeName}`);
        };
      };

      clearRequest.onerror = () => {
        reject(`Lỗi khi xóa dữ liệu cũ từ ${storeName}`);
      };
    });
  }
}

export const indexedDBService = new IndexedDBService();
