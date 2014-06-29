using System;
using System.Collections.Generic;
using System.Text;

namespace RecipeCalculator
{
    class Ingredient
    {
        public double Amount {get; set;}
        private String Name;

        public Ingredient(double amount, String name)
        {
            this.Amount = amount;
            this.Name = name;
        }

        public Ingredient(String name)
        {
            this.Amount = 0;
            this.Name = name;
        }

        public override String ToString()
        {
            if (HasAmount())
                return Amount + " " + Name;
            return Name;
        }

        public bool HasAmount()
        {
            return Amount != 0;
        }
        //public double GetAmount()
        //{
        //    return Amount;
        //}

        //internal void SetAmount(double amount)
        //{
        //    this.Amount = amount;
        //}
    }
}
