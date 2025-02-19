import { Subdistrict } from '@/api/public/locations/subdistricts/Subdistrict.dto'

export class Branch {
  public id!: number
  public name!: string
  public cpName!: string
  public cpPhone!: string
  public address!: string

  public subdistrictCode?: string
  public subdistrict!: Subdistrict
  // TODO
  // public users: Array<User> = []

  constructor(data: Branch) {
    this.address = data.address
    this.cpName = data.cpName
    this.cpPhone = data.cpPhone
    this.id = data.id
    this.name = data.name
    if (data.subdistrict) {
      this.subdistrict = new Subdistrict(data.subdistrict)
    }
    if (data.subdistrictCode) {
      this.subdistrictCode = data.subdistrictCode
    }
  }
}