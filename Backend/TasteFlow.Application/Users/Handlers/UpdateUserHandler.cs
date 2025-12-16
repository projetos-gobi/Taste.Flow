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
    public class UpdateUserHandler : IRequestHandler<UpdateUserCommand, UpdateUserResponse>
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IEventLogger _eventLogger;
        private readonly IMapper _mapper;


        public UpdateUserHandler(IUsersRepository usersRepository, IEventLogger eventLogger, IMapper mapper)
        {
            _usersRepository = usersRepository;
            _eventLogger = eventLogger;
            _mapper = mapper;
        }

        public async Task<UpdateUserResponse> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var user = _mapper.Map<Domain.Entities.Users>(request.User);

                var result = await _usersRepository.UpdateUserAsync(user);

                return new UpdateUserResponse(result, (result) ? "Usuário atualizado com sucesso." : "Não foi possível atualizar o usuário.");
            }
            catch (Exception ex)
            {
                var message = $"Ocorreu um erro durante o processo atualização de um usuário pelo ID: {request.User.Id}";

                //_eventLogger.Log(LogTypeEnum.Error, ex, message);

                return UpdateUserResponse.Empty("Ocorreu um erro durante o processo atualização de um usuário.");
            }
        }
    }
}
