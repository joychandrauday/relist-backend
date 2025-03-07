import { ICategory } from "./category.interface";
import Category from "./category.model";


const addCategory = async (category: ICategory) => {
    return await Category.create(category);
};

const getCategory = async () => {
    return await Category.find()
};

export default {
    addCategory,
    getCategory
};
