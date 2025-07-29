import Counter from '../models/counter.model';

export const getNextItemId = async (): Promise<string> => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'item' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return `item ${counter.value}`;
};