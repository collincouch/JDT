using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace JDT.Models
{
    public class Ingredient:JDTBase
    {
        public Ingredient()
        {
            this.Recipes = new HashSet<Recipe>();
        }
        [Required, Key, DatabaseGenerated(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity)]
        public int IngredientId { get; set; }
        public virtual ICollection<Recipe> Recipes{get;set;}
       
    }
}