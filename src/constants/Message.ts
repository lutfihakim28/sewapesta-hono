export const messages = {
  errorServer: 'Terjadi kesalahan server.',
  tokenNotFound: 'Token tidak ditemukan atau kadaluarsa.',
  unauthorized: 'Token tidak valid.',
  successDeposit: 'Berhasil menambah saldo.',
  successWithdraw: 'Berhasil menarik saldo.',
  invalidCredential: 'Nama pengguna atau kata sandi salah.',
  successLogin: 'Berhasil masuk.',
  successLogout: 'Berhasil keluar.',
  errorNotFound: (data: string) => `${data.charAt(0).toUpperCase() + data.slice(1)} tidak ditemukan`,
  successList: (data: string) => `Berhasil mengambil daftar ${data}.`,
  successDetail: (data: string) => `Berhasil mengambil detail ${data}.`,
  successCreate: (data: string) => `Berhasil menambah ${data}.`,
  successUpdate: (data: string) => `Berhasil memperbarui ${data}.`,
  successPatch: (data: string, field: string) => `Berhasil memperbarui ${field} ${data}.`,
  successDelete: (data: string) => `Berhasil menghapus ${data}.`,
}

export class Message {
  public static errorServer = 'Terjadi kesalahan server.';
  public static tokenNotFound = 'Terjadi kesalahan server.';
  public static unauthorized = 'Terjadi kesalahan server.';
  public static successDeposit = 'Terjadi kesalahan server.';
  public static successWithDraw = 'Terjadi kesalahan server.';
  public static invalidCredential = 'Terjadi kesalahan server.';
  public static successLogin = 'Terjadi kesalahan server.';
  public static successLogout = 'Terjadi kesalahan server.';

  public static errorNotFound(data: string) {
    return `${data.charAt(0).toUpperCase() + data.slice(1)} tidak ditemukan`
  }
  public static successList(data: string) {
    return `Berhasil mengambil daftar ${data}.`
  }
  public static successDetail(data: string) {
    return `Berhasil mengambil detail ${data}.`
  }
  public static successCreate(data: string) {
    return `Berhasil menambah ${data}.`
  }
  public static successUpdate(data: string) {
    return `Berhasil memperbarui ${data}.`
  }
  public static successPatch(data: string, field: string) {
    return `Berhasil memperbarui ${field} ${data}.`
  }
  public static successDelete(data: string, field: string) {
    return `Berhasil menghapus ${data}.`
  }
}