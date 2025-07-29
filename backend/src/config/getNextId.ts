// backend/utils/getNextTechnicianId.ts
import Counter from '../models/counter.model';

export const getNextTechnicianId = async (): Promise<string> => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'technicianId' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return `tech ${counter.value}`;
};

export const getNextuserId = async (): Promise<string> => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'technicianId' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return `tech ${counter.value}`;
};

export const getNextInvId = async (): Promise<string> => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'inventoryId' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return `inv25${counter.value}`;
};
export const getNextPartId = async (): Promise<string> => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'partId' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return `Prt25${counter.value}`;
};
// export const generateCustomId = async (): Promise<string> => {
//   const counter = await Counter.findOneAndUpdate(
//     { name: 'customerId' },
//     { $inc: { value: 1 } },
//     { new: true, upsert: true }
//   );
//     return `cust ${counter.value}`;
// };

export const expId = async (): Promise<string> => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'expId' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return `exp ${counter.value}`;
};