<?php namespace Mariano\Video\Updates;

use Illuminate\Support\Facades\Schema;
use October\Rain\Database\Updates\Migration;

class CreateVideosTable extends Migration
{

    public function up()
    {
        Schema::create('mariano_video_videos', function($table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('mariano_video_videos');
    }

}
