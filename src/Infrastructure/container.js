/* istanbul ignore file */

const { createContainer } = require('instances-container');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

const UserRepository = require('../Core/domains/users/UserRepository');
const PasswordHash = require('../Core/applications/security/PasswordHash');
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const AddUserUseCase = require('../Core/applications/use_case/AddUserUseCase');
const AuthenticationTokenManager = require('../Core/applications/security/AuthenticationTokenManager');
const JwtTokenManager = require('./security/JwtTokenManager');
const LoginUserUseCase = require('../Core/applications/use_case/LoginUserUseCase');
const AuthenticationRepository = require('../Core/domains/authentications/AuthenticationRepository');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const LogoutUserUseCase = require('../Core/applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../Core/applications/use_case/RefreshAuthenticationUseCase');
const ThreadRepository = require('../Core/domains/threads/ThreadRepository');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');
const AddThreadUseCase = require('../Core/applications/use_case/AddThreadUseCase');
const CommentRepository = require('../Core/domains/comments/CommentRepository');
const AddCommentUseCase = require('../Core/applications/use_case/AddCommentUseCase');
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres');
const DeleteCommentUseCase = require('../Core/applications/use_case/DeleteCommentUseCase');
const GetThreadUseCase = require('../Core/applications/use_case/GetThreadUseCase');

const container = createContainer();

container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
]);

container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: GetThreadUseCase.name,
    Class: GetThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
      ],
    },
  },
]);

module.exports = container;