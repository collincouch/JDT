using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace JDT.Models
{
    public class Recipe:JDTBase
    {
        public Recipe()
        {
            this.Diets = new HashSet<Diet>();
            this.Ingredients = new HashSet<Ingredient>();
        }
        [Required, Key, DatabaseGenerated(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity)]
        public int RecipeId { get; set; }
        public virtual ICollection<Diet> Diets{get;set;}
        public virtual ICollection<Ingredient> Ingredients { get; set; }
        
    }
}