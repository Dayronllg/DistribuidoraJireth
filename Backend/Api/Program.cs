using System.Text;
using Api.Models;
using Api.Repositery;
using Api.Repositery.IRepositery;
using Api.Repositery.IRepositery.ITrabajadorRepositery;
using Api.Repositery.ServiceRepositery;
using Api.Security;
using Api.Validaciones.IValidationsService;
using Api.Validaciones.ValidationServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//builder.Services.AddAuthorization();
//builder.Services.AddAuthentication("Bearer").AddJwtBearer();//

builder.Services.AddScoped<DistribuidoraContext>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddSingleton<Utilidad>();
builder.Services.AddScoped<IUserValidation, UserValidation>();
builder.Services.AddScoped<IValidationProduct, ValidationProduct>();
builder.Services.AddScoped<IProductService, Product_service>();
builder.Services.AddScoped<ITrabajador, TrabajadorService>();
builder.Services.AddScoped<IRolService, RolService>();
builder.Services.AddScoped<IMarcaService, MarcaService>();
builder.Services.AddAutoMapper(typeof(Api.MapConfig));
builder.Services.AddAuthentication(config =>
{
    config.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    config.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(config =>
{
    config.RequireHttpsMetadata = false;
    config.SaveToken = true;
    config.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateIssuer = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,
        IssuerSigningKey = new SymmetricSecurityKey
        (Encoding.UTF8.GetBytes(builder.Configuration["Jwt:key"]!))
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(name:"Mypolicy", policy=>
    {
        policy.WithOrigins("http://localhost:5173").AllowAnyMethod().AllowAnyHeader();
    });
});




var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI( 
    );
}
 
app.UseHttpsRedirection();
app.UseCors("Mypolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
