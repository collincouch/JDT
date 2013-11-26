using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace JDT.Models
{
    public class Exercise:JDTBase
    {
        public Exercise()
        {
            this.WorkOuts = new HashSet<WorkOut>();
        }
        [Required, Key, DatabaseGenerated(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity)]
        public int ExerciseId { get; set; }
        [Range(1,50)]
        public int? RecMinSets { get; set; }
        [Range(1, 50)]
        public int? RecMaxSets { get; set; }
        [Range(1,50)]
        public int? RecMinReps { get; set; }
        [Range(1, 50)]
        public int? RecMaxReps { get; set; }
        
        public int? RecDuration { get; set; }

        public virtual ICollection<WorkOut> WorkOuts { get; set; }
        
    }
}