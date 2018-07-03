using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MimibotWebserver.Models
{
    public class Mark
    {
        [Key]
        public string MarkId { get; set; }
        public string UserId { get; set; }
        public string Question { get; set; }
        public string MarkValue { get; set; }
        public string Date { get; set; }
    }
}
