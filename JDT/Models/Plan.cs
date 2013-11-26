using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace JDT.Models
{
    
    public class Plan:JDTBase
    {
        public Plan()
        {
            this.WorkOuts = new HashSet<WorkOut>();
            //this.Author = HttpContext.Current.User.Identity as ApplicationUser;
            //this.AuthorId = System.
        }

        [Required, Key, DatabaseGenerated(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity)]
        public int PlanId { get; set; }
        public UserProfile Creator { get; set; }
        public int CreatorId { get; set; }
        //public string ConsumerId { get; set; }

        public virtual ICollection<WorkOut> WorkOuts { get; set; }
        public virtual ICollection<Diet> Diets { get; set; }
        public virtual ICollection<InvitedUser> InvitedUsers { get; set; }
        
    }
}