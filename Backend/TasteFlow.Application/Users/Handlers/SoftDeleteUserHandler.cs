using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TasteFlow.Application.Users.Commands;
using TasteFlow.Application.Users.Responses;
using TasteFlow.Domain.Interfaces.Common;
using TasteFlow.Domain.Interfaces;

namespace TasteFlow.Application.Users.Handlers
{
    public class SoftDeleteUserHandler : IRequestHandler<SoftDeleteUserCommand, SoftDeleteUserResponse>
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;


        public SoftDeleteUserHandler(IUsersRepository usersRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _usersRepository = usersRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<SoftDeleteUserResponse> Handle(SoftDeleteUserCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _usersRepository.SoftDeleteUserAsync(request.Id, Guid.Empty);

                return new SoftDeleteUserResponse(result, (result) ? "Usuário foi deletada com sucesso." : "Não foi possível deletar a usuário.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo soft delete de um usuário pelo ID: {request.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return SoftDeleteUserResponse.Empty("Ocorreu um erro durante o processo soft delete de um usuário.");
            }
        }
    }
}
