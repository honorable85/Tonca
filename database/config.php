<?php
unset($db_config);

global $db_config;

$db_config = new stdClass;

$db_config->db_host = 'localhost';
$db_config->db_user = 'root';
$db_config->db_pswd = 'passme';
$db_config->db_name = 'pdms';
$db_config->table_prefix = 'pdms_';