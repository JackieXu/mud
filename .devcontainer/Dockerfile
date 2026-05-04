FROM mcr.microsoft.com/devcontainers/typescript-node:1-24-bookworm

ENV HOME /home/node

# pnpm
ENV PNPM_HOME $HOME/.local/share/pnpm
RUN pnpm config set store-dir ${PNPM_HOME}/store
