import { createStorage } from "unstorage"

export const storage = createStorage({
  driver: tauriFsDriver(),
})