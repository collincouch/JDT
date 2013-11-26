using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace JDT.Models
{
    public class WorkOut:JDTBase
    {
        public WorkOut()
        {
            this.Plans = new HashSet<Plan>();
            this.Exercises = new HashSet<Exercise>();
        }
        [Required, Key, DatabaseGenerated(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity)]
        public int WorkOutId { get; set; }
        public virtual ICollection<Plan> Plans { get; set; }
        public virtual ICollection<Exercise> Exercises { get; set; }
       
    }
}