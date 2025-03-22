import { ICategory } from "./category.interface";
import Category from "./category.model";


const addCategory = async (category: ICategory) => {
    return await Category.create(category);
};

const getCategory = async () => {
    return await Category.find()
};
// edit category using put method

const editCategory = async (categoryId: string, updatedCategory: ICategory) => {
    return await Category.findByIdAndUpdate(categoryId, updatedCategory, { new: true });
};

const deleteCategory = async (categoryId: string) => {
    return await Category.findByIdAndDelete(categoryId);
};

export default {
    addCategory,
    getCategory,
    editCategory,
    deleteCategory
};
