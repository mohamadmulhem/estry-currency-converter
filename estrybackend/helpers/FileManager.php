<?php
namespace Estry\CurrencyConverter\Helpers;
/**
 * Class FileManager
 * @package Estry\CurrencyConverter\Helpers
 *
 * Provides general io functions which can be called statically
 */
class FileManager
{
    public function Exists($file)
    {
        if (file_exists($file)) {
            return true;
        }
        return false;
    }

    public function GetSize($file)
    {
        if (static::exists($file)) {
            return filesize($file);
        }
        return false;
    }

    public function Remove($file)
    {
        if (static::exists($file)) {
            return unlink($file);
        }
    }

    public function GetContent($file)
    {
        return file_get_contents($file);
    }

    public function GetExtension($file)
    {
        return pathinfo($file, PATHINFO_EXTENSION);
    }

    public function GetFileNameExt($fileName)
    {
        $sepext = explode('.', $fileName);
        return end($sepext);
    }

    public function GetFileName($file)
    {
        return pathinfo($file, PATHINFO_FILENAME);
    }

    public function Write2File($file, $contents, $append = false)
    {
        if ($append) {
            return file_put_contents($file, $contents, FILE_APPEND | LOCK_EX);
        } else {
            return file_put_contents($file, $contents);
        }
    }

    public function Append2File($file, $contents)
    {
        return put($file, $contents, true);
    }

    public function GetTimeModified($file)
    {
        return filemtime($file);
    }

    public function Truncate($file)
    {
        if (static::exists($file)) {
            $handle = fopen($file, 'w');
            fclose($handle);
            return true;
        }
        return false;
    }

    public function GetFileNames($path, $extension)
    {
        $filenames = array();
        $files = glob($path . "/*." . $extension);
        foreach ($files as $file) {
            $filenames[] = pathinfo($file, PATHINFO_FILENAME);
        }
        return $filenames;
    }

    public function GetBase64($path)
    {
        $type = pathinfo($path, PATHINFO_EXTENSION);
        $data = file_get_contents($path);
        return 'data:image/' . $type . ';base64,' . base64_encode($data);
    }

    public function CreateFileFromBase64($path, $data)
    {
        list($type, $data) = explode(';', $data);
        list(, $data) = explode(',', $data);
        $data = base64_decode($data);
        return file_put_contents($path, $data);
    }

}