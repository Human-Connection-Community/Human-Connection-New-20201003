#!/usr/bin/env bash
set -e

echo "What's the nickname of your server?"
read nickname

echo "What will be the new domain?"
read domain

script_directory=$(dirname "$0")

# traefik_domain="traefik.${domain}"
# traefik_password=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1)
# redaktion_password=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1)
sudo_password=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1)

# postgres_password=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1)
# secret_key_base=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1)
# postgres_password=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1)
# inbound_email_password=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1)

CONFIG_FILE=$(mktemp /tmp/host.XXXXXXXXXX)


cat > $CONFIG_FILE <<- CONFIGURATION
netcup:
  nick: "${nickname}"  #
  root_password: # (optional) you can store your root password here
  sudo_password: "${sudo_password}"
  hostname: # (REQUIRED) e.g. v0000000000000000000.megasrv.de

# dns:
#   application_hostname: "${domain}" # e.g. 'hundred.tactile.news'
#   traefik_hostname: "${traefik_domain}" # e.g. 'traefik.tactile.news'

# traefik:
#   acme_email_address: # (REQUIRED) an email address used for expiration warnings
#   user: traefik
#   password: "${traefik_password}"

# rails:
#   environment: production
#   hundred_eyes_project_name: 100eyes
#   telegram_bot:
#     api_key: # (REQUIRED) your telegram API token
#     username: # (REQUIRED) your telegram bot name, e.g. 'HundredEyesBot'
#   secret_key_base: "${secret_key_base}"
#   postgres:
#     user: app
#     db: app_production
#     password: "${postgres_password}"
#     host: # optional (e.g. for managed databases)
#     port: # optional (e.g. for managed databases)
#   inbound_email_password: "${inbound_email_password}"
#   email_from_address: "redaktion@${domain}"
#   postmark:
#     api_token: # (REQUIRED) API token for your new Postmark server
#     transactional_stream: "outbound"
#     broadcasts_stream: "broadcasts"
#   login:
#     user: redaktion
#     password: "${redaktion_password}"
CONFIGURATION

cat <<- INSTRUCTIONS
--------------------------------------------------------------------------------------------------------------------------
  INSTRUCTIONS:
--------------------------------------------------------------------------------------------------------------------------

  1. Configure your DNS-Server:

    A  ${domain} -> IP ADDRESS
    A  ${traefik_domain} -> IP ADDRESS
    # MX ${domain} -> inbound.postmarkapp.com

  # 2. Configure Postmark:

  #    - Log in to your Postmark account.

  #    - Add "${domain}" as sender domain in the "Sender Signatures"
  #      section. Follow the instructions displayed in the Postmark UI
  #      to verify the domain.

  #    - In the "Servers" section, create a new server. This allows you
  #      to keep separate email logs for every 100eyes instance.

  #    - Switch to the new  server and create a new message stream. Select
  #      "Broadcasts" as name *and* type of the new stream.

  #    - Switch to the "Settings" tab for the "Inbound" message stream.

  #    - Enter the following URL as the inbound webhook. Make sure to check the
  #      "Include raw email content" checkbox.
  #      https://actionmailbox:${inbound_email_password}@${domain}/rails/action_mailbox/postmark/inbound_emails

  #    - Add "${domain}" as the inbound domain.

  3. Encrypt the configuration as host variable file:

    $ ansible-vault encrypt ${CONFIG_FILE} --output ${script_directory}/inventories/custom/host_vars/${nickname}.yml

  4. Add missing configuration, e.g. Telegram API token:

    $ ansible-vault edit ${script_directory}/inventories/custom/host_vars/${nickname}.yml

  5. Add your server "${nickname}" in your ${script_directory}/inventories/custom/hosts file:

    [webservers]
    ${nickname}
--------------------------------------------------------------------------------------------------------------------------
INSTRUCTIONS

