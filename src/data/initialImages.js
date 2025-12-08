export const initialImages = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
    image: `https://api.dicebear.com/9.x/avataaars/svg?seed=${i + 1}&backgroundColor=b6e3f4,c0aede,d1d4f9`
}));
