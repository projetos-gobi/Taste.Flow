using System;
using System.Security.Cryptography;
using System.Text;

namespace TasteFlow.PasswordHashGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            string password = "Admin@123";
            string salt = "tasteflow2024";
            
            string hash = ToSha256Hash(password, salt);
            
            Console.WriteLine("===========================================");
            Console.WriteLine("HASH DE SENHA GERADO");
            Console.WriteLine("===========================================");
            Console.WriteLine($"Senha: {password}");
            Console.WriteLine($"Salt: {salt}");
            Console.WriteLine($"Hash: {hash}");
            Console.WriteLine("===========================================");
            Console.WriteLine("\nCopie o hash acima e cole no SQL:");
            Console.WriteLine($"\"PasswordHash\", \"PasswordSalt\"");
            Console.WriteLine($"'{hash}', '{salt}'");
            Console.WriteLine("===========================================");
        }

        public static string ToSha256Hash(string password, string salt)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password.Trim() + salt));

                StringBuilder builder = new StringBuilder();
                foreach (byte b in bytes)
                {
                    builder.Append(b.ToString("x2"));
                }

                return builder.ToString();
            }
        }
    }
}

