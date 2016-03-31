<?php namespace Mariano\Video\Models;

use October\Rain\Database\Model;
use System\Models\File as FileModel;
/**
 * video Model
 */
class Video extends Model
{

    /**
     * @var string The database table used by the model.
     */
    public $table = 'mariano_video_videos';

    public $rules = [
        'name' => 'required|between:3,128',
    ];

    /**
     * @var array Guarded fields
     */
    protected $guarded = ['*'];

    /**
     * @var array Fillable fields
     */
    protected $fillable = [];

    /**
     * @var array Relations
     */
    public $hasOne = [];
    public $hasMany = [];
    public $belongsTo = [];
    public $belongsToMany = [];
    public $morphTo = [];
    public $morphOne = [];
    public $morphMany = [];
    public $attachOne = [
        'video' => [FileModel::class, 'order' => 'sort_order'],
    ];
    public $attachMany = [];

}