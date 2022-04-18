<?php
require_once __DIR__ . '/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/SMTP.php';
require_once __DIR__ . '/PHPMailer/Exception.php';

function print_data($data)
{
  echo "<pre>" . print_r($data, true) . "<pre>";
}

function validate_field($value)
{
  $value = trim($value);
  $value = stripslashes($value);
  $value = htmlspecialchars($value);
  return $value;
}

$name = $tel = $text = "";

if (isset($_POST)) {
  foreach ($_POST as $key => $value) {
    if (isset($key) and trim($value) !== "") {
      $name = validate_field($_POST["name"]);
      $tel = validate_field($_POST["tel"]);
      $text = validate_field($_POST["comment"]);
    } else {
      echo "Ошибка! Пустые поля!";
      exit;
    }
  }
  echo "Ваша заявка отправлена!";
} else {
  echo "Ошибка! Запрос не определен!";
  exit;
}

$title = "Новая заявка с сайта Уют Ремонт";
$body = "<h2>Новая заявка</h2>";
$body .= "<b>Имя:</b> " . $name . "<br>";
$body .= "<b>Телефон:</b> " . $tel . "<br>";
$body .= "<b>Сообщение:</b> " . $text . "<br>";

echo $body;

$mail = new PHPMailer\PHPMailer\PHPMailer();
try {
  $mail->isSMTP();
  $mail->CharSet = "UTF-8";
  $mail->SMTPAuth   = true;
  // $mail->SMTPDebug = 2;
  $mail->Debugoutput = function ($str, $level) {
    $GLOBALS['status'][] = $str;
  };

  // Настройки вашей почты
  $mail->Host       = 'smtp.gmail.com'; // SMTP сервера вашей почты
  $mail->Username   = 'xxxxxxxxxxxx@gmail.com'; // Логин на почте
  $mail->Password   = 'xxxxxxxxxxxxx'; // Пароль на почте
  $mail->SMTPSecure = 'ssl';
  $mail->Port       = 465;
  $mail->setFrom('yutremont27@mail.ru', 'Уют Ремонт'); // Адрес самой почты и имя отправителя

  // Получатель письма
  $mail->addAddress('xxxxxxxxxx@mail.ru');

  // Отправка сообщения
  $mail->isHTML(true);
  $mail->Subject = $title;
  $mail->Body = $body;

  // Проверяем отравленность сообщения
  if ($mail->send()) {
    $result = "success";
  } else {
    $result = "error";
  }
} catch (Exception $e) {
  $result = "error";
  $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}

// Отображение результата
echo json_encode(["result" => $result, "resultfile" => $rfile, "status" => $status]);
