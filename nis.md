# Understanding NIS
September 8th, 2024
## Introduction
Imagine you are a sysadmin setting up an entreprise network. The company wants to put a *nix workstation at every desk, and they want any user to be able to log into any workstation, and treat them all the exact same. This way, if users need to move workstations, they can do so seamlessly. They have a couple requirements:
1. Use Unix-centric protocols. i.e. no SMB, LDAP, or Kerberos.
2. Personal files and settings should be synchronized between all systems for all users.
3. Log-in information should be the same across all workstations without having to manually add a new user to every workstation individually.
4. Permissions and privledges should be maintained. i.e. administrators should have root access on all systems, and normal users should only be able to access their own files.

The solution: NIS, NSS, and NFS.
## What is NIS?
NIS is a network protocol developped by Sun Microsystems. It was originally called YellowPages, hence the acronym YP seen in many commands/files. It was renamed for copyright reasons.

NIS can be simply understood as a way to synchronize certain configuration files in `/etc` between systems. You've probably heard of most of them:
- `/etc/passwd` - Stores user data including username, UID and GID, full name, homedir, shell, etc.
- `/etc/shadow` - Stores sensitive user data, notably the salted hash of the user's password.
- `/etc/group` - Stores user groups, their GIDs, and their members.
- `/etc/hosts` - Stores the hostnames of systems on the network and their IP addresses, basically a primitive DNS.
- and more can be configured

However, NIS doesn't work simply by copying the main `/etc` files from the server to the workstations. Instead, it takes advantage of how the C library accesses these files.
## NSS
NSS stands for Name Service Switch. It's a part of the C Library of most POSIX OSes that controls how programs access the `/etc` databases.

In the olden days, when a program running on a Unix system wanted to access user data, it would call C library routines which would simply read and parse the `/etc` files, like `/etc/passwd`, `/etc/shadow`, and `/etc/group`.
This worked, because all users in an organization would be remotely logged into a central mainframe, with all commands running on the same system. This means that user information only had to be kept in one place. Eventually, though, companies decided to give each user their own personal workstation, which would help distribute the computational load. A central server would remain in place of the mainframe to handle file storage, email, and of course, authentication.

So Sun Microsystems modified the C library, causing C routines for authentication to be handled differently depending on how the system was configured.

NSS is configured by the file `/etc/nsswitch.conf`. This file contains a list of each database and how to access it. An example might be:
```
passwd: files
group: files
shadow: files
gshadow: files

hosts: files dns
...etc
```
On a normal system or an NIS main server, this files tells programs which need to read data from the databases where to get the information from. Each database can be provided by a selection of "modules", where the most important is the `files` module. This tells programs to read the files in `/etc/` to get information about users and groups.

On an NIS client system, the file might look more like this:
```
passwd: nis files
group: nis files
shadow: nis files
gshadow: nis files

hosts: files dns
...etc
```
This tells programs to get user data from the NIS client program, `ypbind`, which in turn gets its data from the NIS server. The server is selected in the file `/etc/yp.conf`, which has a line like this:
```
ypserver 12.34.56.78
```
## NIS Server
The server maintains its own database of what users and groups should be accessible from the clients, located in `/var/yp`. This database is updated based on the `/etc` files on the server. This way, users can be created normally on the server by adding lines to `/etc/passwd` and `/etc/shadow` or using `adduser`. After updating the NIS database, those new users will be accessible from any NIS client on the network. The NIS Server is configured with the file `/etc/ypserv.conf`. The final challenge is to handle file sharing for all users. This isn't very difficult, thankfully.
## NFS
To make users' files accessible across all systems, We just need to share the `/home` directory on the server with all of the clients. This is done using NFS, a file sharing protocol developped by (you guessed it) Sun Microsystems. The biggest benefit of NFS is that, being made for Unix, it has no problem handing permissions and ownership of users' files. As long as NIS is configured correctly, giving logged-in users the correct UID, they should be able to access their files, which are shared with that same UID.
## Conclusion
Sun Microsystems did a very good job at elegantly allowing users to move between clients, while keeping all of their files, settings, and log-in information in one place. Also, since groups are synchronized between clients, sudo will correctly give administrators root privileges on any client. And since NSS is directly integrated into the C library, any program that performs authentication, including graphical display managers like GDM or LightDM, will let users log in with their credentials seamlessly.