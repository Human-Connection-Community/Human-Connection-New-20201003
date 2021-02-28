# Local setup

Our setup uses a number of community-maintained Ansibles roles. Install them using the `ansible-galaxy` command:

```
ansible-galaxy collection install community.general
ansible-galaxy install geerlingguy.docker
ansible-galaxy install geerlingguy.pip
```


Generate configuration files:
```bash
$ ./ansible/generate_config.sh
# follow the instructions
```

You can repeat the above step for every server that you want to setup.


Then create a file `inventories/custom/hosts` with the following content:
```ini
[webservers]
nickname
# ...
# add nicknames of more servers here
```

# Snapshot

If you already created a snapshot, you can continue with
[Installation](#installation).

To make the setup quicker and easier, we suggest to create a snapshot of a base
image with a user `ansible` and all authorized keys of your friends in place.


Add public keys of your friends in folder `./ansible/ssh/`. It should look like this:
```
$ ls .ansible/ssh
jakob_id_rsa.pub  till.pub
```

Run this playbook to create the ansible user with authorized keys in place and
ensure basic security:
```
$ ANSIBLE_HOST_KEY_CHECKING=false ansible-playbook ansible/snapshot.yml -i ansible/inventories/custom --ask-pass --ask-vault-pass
```

You need `sshpass` installed and you will be asked for:
```
SSH password: # root user password
Vault password: # vault password
```

Now go to your server control panel and create and download a snapshot.

# Installation

If you provisioned your server as in section [Snapshot](#snapshot) or you
restored a new server from the snapshot, then your authorized keys are in place
and you can run the entire installation of the application with:

```bash
ansible-playbook ansible/site.yml -i ansible/inventories/custom --ask-vault-pass
```


## References

Disable password login for all users and disable root login:
* https://www.cyberciti.biz/faq/how-to-disable-ssh-password-login-on-linux/
* https://www.cyberciti.biz/tips/linux-unix-bsd-openssh-server-best-practices.html
* https://traefik.io/blog/traefik-2-0-docker-101-fc2893944b9d/
