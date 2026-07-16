import { prisma } from "./prisma";

const MONTH_CODES: Record<number, string> = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F",
  6: "J",
  7: "H",
  8: "S",
  9: "O",
  10: "N",
  11: "D2",
};

export function getMonthCode(month: number): string {
  return MONTH_CODES[month] || "X";
}

export function generateBaseOrderId(
  date: Date,
  orderNumber: number
): string {
  const monthCode = getMonthCode(date.getMonth());
  const year = date.getFullYear().toString().slice(-2);
  const day = date.getDate().toString().padStart(2, "0");
  const orderNum = orderNumber.toString().padStart(2, "0");

  return `${monthCode}${year}${day}${orderNum}`;
}

export async function generateUniqueOrderId(
  orderNumber: number,
  date?: Date
): Promise<string> {
  const currentDate = date || new Date();
  const baseId = generateBaseOrderId(currentDate, orderNumber);

  const existing = await prisma.order.findUnique({
    where: { orderId: baseId },
  });

  if (!existing) {
    return baseId;
  }

  let suffix = 1;
  let uniqueId = `${baseId}-${suffix}`;

  while (true) {
    const exists = await prisma.order.findUnique({
      where: { orderId: uniqueId },
    });

    if (!exists) {
      return uniqueId;
    }

    suffix++;
    uniqueId = `${baseId}-${suffix}`;
  }
}
