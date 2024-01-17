using Microsoft.AspNetCore.Authorization;
using System.Net.NetworkInformation;
using System.Security.Claims;

namespace Api
{
    public static class SD
    {
        public const string Google = "google";
        public const string Facebook = "facebook";

        //roles
        public const string AdminRole = "Admin";
        public const string ManagerRole = "Manager";
        public const string PlayerRole = "Player";


        public static bool VIPPolicy(AuthorizationHandlerContext context)
        {

            if(context.User.IsInRole(PlayerRole) && 
                context.User.HasClaim(c=> c.Type == ClaimTypes.Email && c.Value.Contains("vip")))
            {
                return true;
            }
            return false;

        }
    }
}
