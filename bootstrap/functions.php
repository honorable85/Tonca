<?php

/**
 * Wordpress is_serialized
 */
if ( ! function_exists( 'is_serialized' ) ) {
    function is_serialized( $data, $strict = true ) { 
        // If it isn't a string, it isn't serialized.
        if ( ! is_string( $data ) ) {
            return false;
        }

        $data = trim( $data );

        if ( 'N;' === $data ) {
            return true;
        }

        if ( strlen( $data ) < 4 ) {
            return false;
        }

        if ( ':' !== $data[1] ) {
            return false;
        }

        if ( $strict ) {
            $lastc = substr( $data, -1 );
            if ( ';' !== $lastc && '}' !== $lastc ) {
                return false;
            }
        } else {
            $semicolon = strpos( $data, ';' );
            $brace     = strpos( $data, '}' );
            // Either ; or } must exist.
            if ( false === $semicolon && false === $brace ) {
                return false;
            }
            // But neither must be in the first X characters.
            if ( false !== $semicolon && $semicolon < 3 ) {
                return false;
            }
            if ( false !== $brace && $brace < 4 ) {
                return false;
            }
        }

        $token = $data[0];

        switch ( $token ) {
            case 's':
                if ( $strict ) {
                    if ( '"' !== substr( $data, -2, 1 ) ) {
                        return false;
                    }
                } elseif ( false === strpos( $data, '"' ) ) {
                    return false;
                }
                // Or else fall through.
            case 'a':
            case 'O':
                return (bool) preg_match( "/^{$token}:[0-9]+:/s", $data );
            case 'b':
            case 'i':
            case 'd':
                $end = $strict ? '$' : '';
                return (bool) preg_match( "/^{$token}:[0-9.E+-]+;$end/", $data );
        }

        return false;
    }
}

if ( ! function_exists( 'maybe_unserialize' ) ) {
    function maybe_unserialize( $data ) {
        if ( is_serialized( $data ) ) { 
            return @unserialize( trim( $data ) );
        }
    
        return $data;
    }
}

if ( ! function_exists( 'get_config' ) ) {
    function get_config($name) {
        $cmd = new Commande();
        $cmd->option('type_commande', PDMS_COMMANDE_LIRE);
        $cmd->option('tables', ['config']);
        $cmd->option('champs', 'config_value');
        $cmd->option('critere_ou', 'config_name = "'. $name . '"');
        $result = $cmd->exec();

        if ($result->statut() === 'succes' AND $result->nbrLignes() > 0) {
            $row = $result->lireLigne();
            return maybe_unserialize( $row['config_value'] );
        }

        return null;
    }
}

if ( ! function_exists( 'set_config' ) ) {
    function set_config($name, $value) {

        if (is_array($value) OR is_object($value)) {
            $value = serialize( $value );
        }

        if (false == get_config($name)) {
            $cmd = new Commande();
            $cmd->option('type_commande', PDMS_COMMANDE_ECRIRE);
            $cmd->option('table', 'config');
            $cmd->option('champs', ['config_name', 'config_value']);
            $cmd->option('valeurs', [
                [$name, $value]
            ]);
            $result = $cmd->exec();

            if ($result->statut() === 'succes') {
                return true;
            }
        } else {
            $cmd = new Commande();
            $cmd->option('type_commande', PDMS_COMMANDE_MAJ);
            $cmd->option('tables', ['config']);
            $cmd->option('champs', ['config_value']);
            $cmd->option('valeures', [$value]);
            $cmd->option('critere_ou', 'config_name = "'. $name . '"');
            $result = $cmd->exec();

            if ($result->statut() === 'succes') {
                return true;
            }
        }

        return false;
    }
}

if ( ! function_exists( 'send_mail' ) ) {
	function send_mail($to, $from, $subject, $body) {
		
        $mail = new \Mail\PHPMailer;
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';
        $mail->isSMTP(true);
        $mail->Host = 'bilacademy.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'no-reply@bilacademy.com';
        $mail->Password = 'Limit123#';
        $mail->SMTPSecure = 'ssl';
        $mail->Port = 465; 

        $mail->WordWrap = 50;
        $mail->Subject = $subject;

        if ( is_array($from) ) {
            $mail->setFrom($from['email'], $from['name']);
        }

        if ( is_array($to) ) {
			$mail->addAddress($to['email'], $to['name']);
		}

		$mail->isHTML(true);
		$mail->Body = $body;
        
        return $mail->send();
	}
}

if ( ! function_exists( 'bind_vars' ) ) {
	function bind_vars ( $str, $bindings ) {

		foreach ( $bindings as $key => $value ) {
			$str = str_replace( $key, $value, $str );
		}

		return $str;
	}
}

if ( ! function_exists( 'mail_render' ) ) {
	function mail_render ( $file, $vars ) {
		$content = file_get_contents( app_path('Routes/views/mail') . '/' . $file . '.html' );
		$content = bind_vars( $content, $vars );

		return $content;
	}
}

if ( ! function_exists('bootstrap_path') ) {
    function bootstrap_path( $path = '' ) {
        return dirname( __FILE__ ) . DIRECTORY_SEPARATOR . $path;
    }
}

if ( ! function_exists('base_path') ) {
    function base_path( $path = '') {
        return dirname( bootstrap_path() ) . $path;
    }
}

if ( ! function_exists('app_path') ) {
    function app_path( $path = '') {
        return base_path() . '/App/' . $path;
    }
}

if ( ! function_exists('root_path') ) {
    function root_path( $path = '') {
        return dirname( base_path() ) . DIRECTORY_SEPARATOR . $path;
    }
}

if ( ! function_exists('storage_path') ) {
    function storage_path( $path = '') {
        return root_path('pdms_storage') . DIRECTORY_SEPARATOR . $path;
    }
}

if ( ! function_exists('config') ) {
    function config($arg, $value = null) {
	
        $nenc = array('url_externe', 'version', 'url_maj', 'key');
        
        $xml = new XML\XDT();
        $xml->connect('config');
        
        if ($xml->select('params')->hasAttr($arg) == false) return false;
        
        if (isset($value)) {
            
            $xml->select('params')->attr($arg, $value);
            
            return $xml->close();
        }
        
        return in_array($arg, $nenc)? $xml->select('params')->attr($arg): \Security\Securite::decrypter($xml->select('params')->attr($arg));
    }
}

if ( ! function_exists( 'info' ) ) {
    function info($arg) {
	
        $url = config('url');
        
        switch ($arg) {
            
            case 'url': return $url;
        }
    }
}

if ( ! function_exists('paginer') ) {
    function paginer($db, $range, $limit, $query_array = NULL) { 
        extract(mysqli_fetch_assoc(mysqli_query($db, 'SELECT FOUND_ROWS() AS num_rows')));
        $GLOBALS['num_rows'] = $num_rows;
        $page_links = '<p>';
        
        if($num_rows > $limit) {
            if(isset($_GET['p'])) {
                $page = $_GET['p'];
            } else {
                $page = 1;
            }
            
            $currpage = $_SERVER['PHP_SELF']; 
            if(!isset($query_array)) {
                $currpage = str_replace('?' . \Security\Securite::creerParametres(array('p'=>$page)), '', $currpage);
            } else {
                $currpage = str_replace('?' . \Security\Securite::creerParametres($query_array), '', $currpage);
            }
            
            if($page == 1) {
                $page_links .= '&laquo; PREC';
            } else {
                if(!isset($query_array)) {
                    $page_links .= "<a href='" . $currpage . "'&p=' . ($page - 1) . '>&laquo; PREC</a>";
                } else {
                    $query_array['p'] = $page - 1;
                    $page_links .= "<a href='" . $currpage . "?" . \Security\Securite::creerParametres($query_array) . "'>&laquo; PREC</a>";
                }
            }
            
            $num_of_pages = $limit ? ceil($num_rows / $limit): 0;
            
            $lrange = max(1, $page - (($range - 1) / 2));
            $rrange = min($num_of_pages, $page + (($range - 1) / 2));
    
    
            if(($rrange - $lrange) < ($range - 1)) {
                if($lrange == 1) {
                    $rrange = min($lrange + ($range - 1), $num_of_pages);
                } else {
                    $lrange = max($rrange - ($range - 1), 0);
                }
            }
            
            if($lrange > 1) {
                if(!isset($query_array)){
                    $page_links .= "<a href='" . $currpage . "?" . \Security\Securite::creerParametres(array('p'=>(1))) . "'>1</a>..";
                } else {
                    $query_array['p'] = 1;
                    $page_links .= "<a href='" . $currpage . "?" . \Security\Securite::creerParametres($query_array) . "'>1</a>..";
                }
            } else {
                $page_links .= '&nbsp;&nbsp;';
            }
            
            for($i = 1; $i <= $num_of_pages; $i++) {
                if($i == $page) {
                    $page_links .= $i;
                } else {
                    if($lrange <= $i && $i <= $rrange) {
                        if(!isset($query_array)) {
                            $page_links .= "<a href='" . $currpage . "?" . \Security\Securite::creerParametres(array('p'=>$i)) . "'>" . $i . "</a>";
                        } else {
                            $query_array['p'] = $i;
                            $page_links .= "<a href='" . $currpage . "?" . \Security\Securite::creerParametres($query_array) . "'>" . $i . "</a>";
                        }
                    }
                }
            }
            
            if($rrange < $num_of_pages) {
                if(!isset($query_array)){
                    $page_links .= "..<a href='" . $currpage . "?" . \Security\Securite::creerParametres(array('p'=>($num_of_pages))) . "'>" . $num_of_pages . "</a>";
                } else {
                    $query_array['p'] = $num_of_pages;
                    $page_links .= "..<a href='" . $currpage . "?" . \Security\Securite::creerParametres($query_array) . "'>" . $num_of_pages . "</a>";
                }
            } else {
                $page_links .= '&nbsp;&nbsp;';
            }
            
            if(($num_rows - ($limit * $page)) > 0) {
                if(!isset($query_array)){
                    $page_links .= "<a href='" . $currpage . "?" . \Security\Securite::creerParametres(array('p'=>($page + 1))) . "'>SUIV &raquo;</a>";
                } else {
                    $query_array['p'] = $page + 1;
                    $page_links .= "<a href='" . $currpage . "?" . \Security\Securite::creerParametres($query_array) . "'>SUIV &raquo;</a>";
                }
            } else {
                $page_links .= 'SUIV &raquo;';
            }
        } else {
            $page_links .= '&laquo; PREC&nbsp;&nbsp;1&nbsp;&nbsp;SUIV &raquo;&nbsp;&nbsp;';
        }
        
        return $page_links .= " <strong>Résultat total:</strong> $num_rows</p>"; 
    }
}

if ( ! function_exists('comptabilite') ) {
    function comptabilite($compte, $montant = 0, $operation = 'recette', $donnees = array()) {
	
        $__donnees = array(
            'date' => date('d/m/Y'),
            'banque' => 'clcam',
            'designation' => '',
            'reference' => '<a  onClick="pdms.master.budget.aprf(event)" href="javascript:void(0)">Ajouter pièce justificative</a>',
            'encaisser' => false
        );
        
        foreach ($__donnees as $c => $v) {
            
            if (!isset($donnees[$c])) $donnees[$c] = $__donnees[$c];
        }
        
        $montant = $operation == 'recette'? $montant: -$montant;
        
        $xml = new XDT();
        $xml->connect('budget' . DIRECTORY_SEPARATOR . config('annee'), true, true);
        $o = $xml->select('compte[valeur=' . $compte . ']');
        
        if ($o->length === 0) {
            
            return false;
        }
        
        $prevue = Securite::decrypter($o->attr('prevue'))+Securite::decrypter($o->attr('ca'))+Securite::decrypter($o->attr('ci'));
        
        if ($operation === 'recette') {
            
            $o->attr('recouvrie', Securite::encrypter(Securite::decrypter($o->attr('recouvrie'))+abs($montant)));
            maj_budget($o->parent('compte'), $montant, 'recouvrie', true);
        }
        
        $xml->close();
        
        // Livre banque
        $xml->connect('budget' . DIRECTORY_SEPARATOR . 'bank-' . config('annee'), true, true);
            
        $ligne = '<tr><td>' . $donnees['date'] . '</td><td>' . $donnees['designation'] . '</td>';
        
        if ($operation == 'depense') {
            
            $ligne .= '<td>' . argent($montant) . '</td><td> -- </td>';
        } else {
            
            $ligne .= '<td> -- </td><td>' . argent($montant) . '</td>';
        }
        
        $o = $xml->select('tbody > tr:last > td:last');
            
        if ($o->length > 0) {
            
            $ligne .= '<td>' . argent(preg_replace('/\s/', '', $o->val())+$montant) . '</td>';
        } else {
            
            $ligne .= '<td>' . argent($montant) . '</td>';
        }
        
        switch($donnees['banque']) {
            case 'caisse': 
                
                $b1 = $xml->getDocumentRootElement()->attr('b1')+$montant;
                $b2 = $xml->getDocumentRootElement()->attr('b2');
                $b3 = $xml->getDocumentRootElement()->attr('b3');
                
                $xml->getDocumentRootElement()->attr('b1', $b1); 
            break;
            
            case 'ccp': 
                
                $b1 = $xml->getDocumentRootElement()->attr('b1');
                $b2 = $xml->getDocumentRootElement()->attr('b2')+$montant;
                $b3 = $xml->getDocumentRootElement()->attr('b3');
                
                $xml->getDocumentRootElement()->attr('b2', $b2); 
            break;
            
            case 'clcam': 
                
                $b1 = $xml->getDocumentRootElement()->attr('b1');
                $b2 = $xml->getDocumentRootElement()->attr('b2');
                $b3 = $xml->getDocumentRootElement()->attr('b3')+$montant;
                
                $xml->getDocumentRootElement()->attr('b3', $b3);
            break;
        }
        
        $xml->select('tbody')->append($ligne . '</tr>');
        $xml->close();
        
        // Tresorerie
        $xml->connect('budget' . DIRECTORY_SEPARATOR . 'cashier-' . config('annee'), true, true);
            
        $ligne = '<tr class="op"><td>' . $donnees['date'] . '</td>';
        
        $caisse = $donnees['encaisser']? argent($montant): argent($montant) . ' <a onClick="pdms.master.budget.ttp(event)" href="javascript:void(0)"><i class="fa fa-question-circle"></i></a>';
        
        //if ($operation === 'recette') $ligne .= '<td>' . $caisse . '</td><td> -- </td>';
        //else $ligne .= '<td> -- </td><td>' . $caisse . '</td>';
        
        $ligne .= '<td><div contenteditable="true"> </div></td><td><div contenteditable="true"> </div></td>';
        
        $ligne .= '<td>' . $compte . '</td><td>' . $donnees['designation'] . '</td><td>' . $donnees['reference'] . '</td>';
        
        if ($tr = $xml->select('tr.op:last') AND $tr->length) {
                    
            $anc_solde = (int)preg_replace('/\s/', '', $tr->children('td:nth(9)')->val());
            $anc_recette = (int)preg_replace('/\s/', '', $tr->children('td:nth(7)')->val());
            $anc_depense = (int)preg_replace('/\s/', '', $tr->children('td:nth(8)')->val());
        } else {
            
            $anc_solde = 0;
            $anc_recette = 0;
            $anc_depense = 0;
        }
        
        if ($operation == 'recette') {
            
            $ligne .= '<td>' . argent($montant) . '</td><td> -- </td><td>' . argent($anc_solde+$montant) . '</td>';
        } else {
            
            $ligne .= '<td> -- </td><td>' . argent(-$montant) . '</td><td>' . argent($anc_solde+$montant) . '</td>';
        }
        
        $ligne .= '<td>' . argent($b1) . '</td><td>' . argent($b2) . '</td><td>' . argent($b3) . '</td>';
        
        $xml->select('tbody')->append($ligne . '</tr>');
        $xml->close();

        // Backup badget
        backup_budget();
        
        return true;
    }
}

if ( ! function_exists('backup_budget') ) {
    function backup_budget() {

        $backup = 'backup-' . config('annee') . '.zip';
        $zip = new ZipArchive();
        $xdt = new XDT;
        $xml_dir = realpath($xdt->getDirectory());
        $backup_dir = base_path('storage');

        if ($zip->open($backup_dir . DIRECTORY_SEPARATOR . $backup, ZipArchive::CREATE)) {
            
            $dir = new RecursiveDirectoryIterator($xml_dir);
        
            foreach (new RecursiveIteratorIterator($dir) as $file) { 
                
                if($file->isFile()) {
                    $filepath = $file->getRealPath();
                    $relativepath = substr($filepath, strlen($xml_dir) + 1);
                    $zip->addFile($filepath, $relativepath);
                }
            }

            $zip->close();
        }
    }
}

if ( ! function_exists('mention') ) {
    function mention($moy) {
	
        if ($moy <= 3) return 'Médiocre';
        elseif ($moy < 10) return 'Mal';
        elseif ($moy <= 12) return 'Passable';
        elseif ($moy <= 14) return 'Assez bien';
        elseif ($moy <= 16) return 'Bien';
        elseif ($moy <= 18) return 'Très bien';
        elseif ($moy <= 20) return 'Excéllent';
    }
}

if ( ! function_exists('annee_suivante') ) {
    function annee_suivante() {
	
        $a = explode('-', config('annee'));
        
        return ($a[0]+1) . '-' . ($a[1]+1);
    }
}

if ( ! function_exists('annee_precedente') ) {
    function annee_precedente() {
	
        $a = explode('-', config('annee'));
        
        return ($a[0]-1) . '-' . ($a[1]-1);
    }
}

if ( ! function_exists( 'get_temp_dir' ) ) {
    function get_temp_dir() {
        if ( function_exists( 'sys_get_temp_dir' ) ) {
            $temp = sys_get_temp_dir();
            if ( @is_dir( $temp ) ) {
                return $temp;
            }
        }
    
        $temp = ini_get( 'upload_tmp_dir' );
        if ( @is_dir( $temp ) ) {
            return $temp;
        }
    
        return '/tmp/';
    }
}

if ( ! function_exists( 'maybeCreateDirectory' ) ) {
    function maybeCreateDirectory($path, $directory) {
        if (file_exists($path . DIRECTORY_SEPARATOR . $directory)) return $path . DIRECTORY_SEPARATOR . $directory;
        
        if(mkdir($path . DIRECTORY_SEPARATOR . $directory)) {
            return $path . DIRECTORY_SEPARATOR . $directory;
        }

        return null;
    }
}