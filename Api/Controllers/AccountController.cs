using Api.DTOs.Account;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        private readonly JWTServices _jwtService;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        public AccountController(JWTServices jwtServices,SignInManager<User> signInManager, UserManager<User> userManager)
        {
            _jwtService = jwtServices;
            _signInManager = signInManager;
                _userManager = userManager;


        }

        [Authorize]
        [HttpGet("refresh-user-token")]

        public async Task<ActionResult<UserDto>> RefreshUserToken()
        {
            var user = await _userManager.FindByNameAsync(User.FindFirst(ClaimTypes.Email)?.Value);
            return CreateApplicationUserDto(user);
        }

        [HttpPost("Login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto model)
        {
            var user= await _userManager.FindByNameAsync(model.UserName);
            if (user == null)
            {
                return Unauthorized("Invalid UserName or Password.");
            }

            if (user.EmailConfirmed == false) return Unauthorized("Please Confirm Your Email.");

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded)
            {
                return Unauthorized("Invalid UserName or Password.");
            }

            return CreateApplicationUserDto(user);

        }


        [HttpPost("Register")]

        public async Task<ActionResult> Register (RegisterDto model)
        {
            if(await CheckEmailExistsAsync(model.Email))
            {
                return BadRequest($"{model.Email} Already Exists.");
            }

            var userToAdd = new User
            {
                FirstName = model.FirstName.ToLower(),
                LastName = model.LastName.ToLower(),
                UserName = model.Email.ToLower(),
                Email = model.Email.ToLower(),
                EmailConfirmed = true

            };

            var result=await _userManager.CreateAsync(userToAdd, model.Password);

            if(!result.Succeeded) { return BadRequest(result.Errors); }

            return Ok("Your Account Has Been Created, You Can Login");
    

        }
        #region Private Helper Methods
        private UserDto CreateApplicationUserDto(User user)
        {
            return new UserDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                JWT=_jwtService.CreateJWT(user),
            };
        }

        private async Task<bool> CheckEmailExistsAsync(string email)
        {
            return await _userManager.Users.AnyAsync(x=> x.Email == email.ToLower());

        }

        #endregion
    }
}
