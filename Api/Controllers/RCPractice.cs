using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RCPractice : ControllerBase
    {

        [HttpGet("public")]

        public IActionResult Public() {
            return Ok("public");
        }

        #region Role

        [HttpGet("admin-role")]
        [Authorize(Roles ="Admin")]
        public IActionResult AdminRole()
        {
            return Ok("admin");
        }

        [HttpGet("manager-role")]
        [Authorize(Roles = "Manager")]
        public IActionResult ManagerRole()
        {
            return Ok("manager");
        }

        [HttpGet("player-role")]
        [Authorize(Roles = "Player")]
        public IActionResult PlayerRole()
        {
            return Ok("Player");
        }


        [HttpGet("admin-or-manager-role")]
        [Authorize(Roles = "Admin,Manager")]
        public IActionResult AdminorManagerRole()
        {
            return Ok("Admin or manager role");
        }


        [HttpGet("admin-or-player-role")]
        [Authorize(Roles = "Admin,Player")]
        public IActionResult AdminorPlayerRole()
        {
            return Ok("Admin or Player role");
        }



        #endregion


        #region Claim Policy
        [HttpGet("admin-policy")]
        [Authorize(policy:"AdminPolicy")]

        public IActionResult AdminPolicy()
        {
            return Ok("Admin Policy");
        }
        [HttpGet("manager-policy")]
        [Authorize(policy: "ManagerPolicy")]

        public IActionResult ManagerPolicy()
        {
            return Ok("Manager Policy");
        }


        [HttpGet("player-policy")]
        [Authorize(policy: "PlayerPolicy")]

        public IActionResult PlayerPolicy()
        {
            return Ok("Player Policy");
        }


        [HttpGet("admin-or-manager-policy")]
        [Authorize(policy: "AdminOrManagerPolicy")]

        public IActionResult AdminOrMangerPolicy()
        {
            return Ok("Admin or Manager Policy");
        }

        [HttpGet("admin-and-manager-policy")]
        [Authorize(policy: "AdminAndManagerPolicy")]

        public IActionResult AdminAndMangerPolicy()
        {
            return Ok("Admin and Manager Policy");
        }


        [HttpGet("all-role-policy")]
        [Authorize(policy: "AllRolesPolicy")]

        public IActionResult AllRolesPolicy()
        {
            return Ok("All roles Policy");
        }

        #endregion


        #region Claim Policy 2

        [HttpGet("admin-email-policy")]
        [Authorize(policy: "AdminEmailPolicy")]

        public IActionResult AdminEmailPolicy()
        {
            return Ok("AdminEmail Policy ");
        }
       

        [HttpGet("player-surname-policy")]
        [Authorize(policy: "PlayerSurnamePolicy")]

        public IActionResult PlayerSurnamePolicy()
        {
            return Ok("PlayerSurname Policy");
        }



        [HttpGet("manager-email-manager-surname-policy")]
        [Authorize(policy: "ManagerEmailAndManagerSurnamePolicy")]

        public IActionResult ManagerEmailAndManagerSurnamePolicy()
        {
            return Ok("ManagerEmailAndManagerSurname Policy");
        }

        [HttpGet("vip-policy")]
        [Authorize(policy: "VIPPolicy")]

        public IActionResult VIPPolicy()
        {
            return Ok("VIP Policy");
        }

        #endregion
    }
}
