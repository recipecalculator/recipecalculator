using System;
using System.Collections.Generic;
using System.Text;

namespace RecipeCalculator
{
    class Recipe
    {
        private int ingredientCounter;
        private Ingredient[] ingredients;
        private const int ARRAY_GROWTH_INDEX = 5;
        private int arraySize = 15;
        char[] trimChars = { ' ', '\t' };

        public Recipe()
        {
            ingredientCounter = 0;
            ingredients = new Ingredient[arraySize];
        }

        public bool ReadRecipe(String[] text)
        {
            for (int i = 0; i < text.Length; i++)
            {
                try
                {
                    NewIngredient(text[i]);
                }
                catch (FormatException)
                {
                    CleanIngredients();
                    return false;
                }
            }
            return true;
        }

        private void CleanIngredients()
        {
            ingredients = new Ingredient[arraySize];
        }

        public void NewIngredient(String ing)
        {
            if (ingredientCounter >= ingredients.Length)
                GrowArray();
            ingredients[ingredientCounter] = StringToIngredient(ing);
            ingredientCounter++;
        }

        public bool CalculatePortions(double origPortion, double newPortion)
        {
            double percent = newPortion / origPortion;
            return Calculate(percent);
        }

        public bool CalculateAmountByIndex(int idx, double newAmount)
        {
            if (ingredients[idx].HasAmount())
            {
                double percent = newAmount / ingredients[idx].Amount;
                return Calculate(percent);
            }
            return false;
        }

        public int GetIngredientCounter()
        {
            return ingredientCounter;
        }

        public String[] ToStringArray()
        {
            String[] recipe = new String[ingredientCounter];
            for (int i = 0; i < ingredientCounter; i++)
            {
                recipe[i] = ingredients[i].ToString();
            }
            return recipe;
        }

        public String[] ToStringArrayWithAmount()
        {
            String[] recipe = new String[ingredientCounter];
            for (int i = 0; i < ingredientCounter; i++)
            {
                if(ingredients[i].HasAmount())
                    recipe[i] = ingredients[i].ToString();
            }
            return recipe;
        }

        private bool Calculate(double percent)
        {
            if (ingredientCounter == 0)
                return false;
            for (int i = 0; i < ingredientCounter; i++)
            {
                if (ingredients[i].HasAmount())
                {
                    double aux = ingredients[i].Amount * percent;
                    aux = (double)Math.Round(aux * 100);
                    aux = aux / 100;
                    ingredients[i].Amount =aux;
                }
            }
            return true;
        }

        private void GrowArray()
        {
            Ingredient[] aux = new Ingredient[arraySize + ARRAY_GROWTH_INDEX];
            Array.Copy(ingredients, aux, ingredientCounter);
           
            ingredients = aux;
            arraySize += ARRAY_GROWTH_INDEX;
        }

        private Ingredient StringToIngredient(String ing) 
        {
            ing = ing.Trim(trimChars);
            if ((ing[0] != ',' && ing[0]!='.') && (ing[0] < '0' || ing[0] > '9'))
                return new Ingredient(ing);
            ing = PointToComma(ing);
            int space = ing.IndexOf(' ');
            if (space < 0)
            {
                throw new FormatException();
            }
            double a = Double.Parse(ing.Substring(0, space));
            return new Ingredient(a, ing.Substring(space + 1));
        }

        public override String ToString()
        {
            String ret = ingredients[0].ToString();
            for (int i = 1; i < ingredientCounter; i++)
            {
                ret = ret + "\n" + ingredients[i].ToString();
            }
            return ret + "\r";
        }
        
        public static String PointToComma(String ing)
        {
            int point = ing.IndexOf('.');
            if (point >= 0)
                ing = ing.Substring(0, point + 1).Replace('.', ',') + ing.Substring(point + 1);
            return ing;
        }
    }
}
