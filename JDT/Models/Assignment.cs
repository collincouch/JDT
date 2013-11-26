using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace JDT.Models
{
    public class Assignment:JDTBase
    {
        [Required, Key, DatabaseGenerated(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity)]
        public int AssignmentId { get; set; }
        public DateTime? DueDate { get; set; }
        public Exercise Task { get; set; }
        public Diet Diet { get; set; }
        public int? WeekNumber { get; set; }
        public int? DayNumber { get; set; }
        public int UserId { get; set; }
        public UserProfile User { get; set; }
    }
}