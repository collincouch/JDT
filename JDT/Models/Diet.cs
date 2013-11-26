using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace JDT.Models
{
    public class Diet:JDTBase
    {
         public Diet()
        {
            this.Plans = new HashSet<Plan>();
            this.Recipes = new HashSet<Recipe>();
        }
        [Required, Key, DatabaseGenerated(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity)]
        public int DietId { get; set; }
        public virtual ICollection<Plan> Plans { get; set; }
        public virtual ICollection<Recipe> Recipes { get; set; }
        
    }
}