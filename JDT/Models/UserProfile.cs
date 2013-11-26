using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace JDT.Models
{
    public class UserProfile
    {
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Email { get; set; }
        public string PictureUrl { get; set; }
        public virtual ICollection<Plan> Plans { get; set; }
        public System.Nullable<int> InvitedById { get; set; }
        public virtual UserProfile InvitedBy { get; set; }
        public virtual List<UserProfile> Friends { get; set; }
        public virtual List<InvitedUser> PreRegisteredFriends { get; set; }
        public virtual List<Assignment> Assignments { get; set; }
    }
}