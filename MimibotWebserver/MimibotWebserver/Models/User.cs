using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MimibotWebserver.Models
{
    public class User
    {
        [Key]
        public string UserId { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }

    }
}
