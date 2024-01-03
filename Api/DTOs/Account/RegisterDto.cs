using System.ComponentModel.DataAnnotations;

namespace Api.DTOs.Account
{
    public class RegisterDto
    {
        [Required]
        [StringLength(15 , MinimumLength =3,ErrorMessage ="First Name must be atleast {2} , and Maximum {1}")]
        public string FirstName { get; set; }

        [Required]
        [StringLength(15, MinimumLength = 3, ErrorMessage = "Last Name must be atleast {2} , and Maximum {1}")]
        public string LastName { get; set; }

        [Required]
        [StringLength(15, MinimumLength = 6, ErrorMessage = "PassWord must be atleast {2} , and Maximum {1}")]
        public string Password { get; set; }

        [Required]
//[RegularExpression("", ErrorMessage ="Invalid Email Address")]
        public string Email { get; set; }

    }
}
