//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WcfJDT
{
    using System;
    using System.Collections.Generic;
    
    public partial class PreConsumer
    {
        public int PreConsumerId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int ContentAuthorId { get; set; }
        public System.DateTime DateCreated { get; set; }
        public System.DateTime DateModified { get; set; }
        public Nullable<int> Plan_PlanId { get; set; }
    
        public virtual Plan Plan { get; set; }
        public virtual UserProfile UserProfile { get; set; }
    }
}
