import Counter from '../models/counter.model';

export const getNextItemId = async (): Promise<string> => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'purchaseItemId' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return `Item ${counter.value}`;
};