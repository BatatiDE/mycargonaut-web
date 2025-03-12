import * as z from "zod";

export const vehicleSchema = z.object({
  type: z.string().min(1, "Fahrzeugtyp ist erforderlich"),
  brand: z.string().min(1, "Marke ist erforderlich"),
  model: z.string().min(1, "Modell ist erforderlich"),
  licensePlate: z.string().min(1, "Kennzeichen ist erforderlich"),
});
