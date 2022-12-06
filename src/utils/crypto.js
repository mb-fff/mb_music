import CryptoJS from 'crypto-js'

// 加密
export const encryp = (key, iv, data) => {
  if (typeof data === 'object') {
    try {
      data = JSON.stringify(data)
    } catch (error) {
      console.log(error)
    }
  }
  // 统一将传入的字符串转成UTF8编码
  const dataHex = CryptoJS.enc.Utf8.parse(data) // 需要加密的数据
  const keyHex = CryptoJS.enc.Utf8.parse(key) // 秘钥
  const ivHex = CryptoJS.enc.Utf8.parse(iv) // 偏移量
  const encrypted = CryptoJS.AES.encrypt(dataHex, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC, // 加密模式
    padding: CryptoJS.pad.Pkcs7
  })
  let encryptedVal = encrypted.ciphertext.toString()
  return encryptedVal //  返回加密后的值
}

// 解密
export const decrypt = (key, iv, encryptedVal) => {
  // 统一将传入的字符串转成UTF8编码
  const encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedVal)
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const keyHex = CryptoJS.enc.Utf8.parse(key) // 秘钥
  const ivHex = CryptoJS.enc.Utf8.parse(iv) // 偏移量
  const decrypt = CryptoJS.AES.decrypt(srcs, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return JSON.parse(decryptedStr)
}

// 生成随机字符串
export const randomString = () => {
  const key = 'asasfs231asda'
  const iv = 'ddasfsd23423g'
  const word = 'sfs3dcsd4zxx'
  return encryp(key, iv, word)
}
