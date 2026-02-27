import { IRow, ISeatsStatus, ISeatType} from "@shared/schemas"

interface ISeat {
  seatNumber: string
  row: string
  type: ISeatType
  priceMultiplier: number
  isActive: ISeatsStatus
}

export const generateSeats = (rows: IRow[]): ISeat[] => {
  const seats: ISeat[] = []

  rows.forEach((row) => {
    for (let i = 1; i <= row.seats; i++) {
      seats.push({
        seatNumber: `${row.name}${i}`,
        row: row.name,
        type: row.type,
        priceMultiplier:
          row.type === "vip"
            ? 1.5
            : row.type === "couple"
            ? 2
            : 1,
        isActive: "empty"
      })
    }
  })

  return seats
}